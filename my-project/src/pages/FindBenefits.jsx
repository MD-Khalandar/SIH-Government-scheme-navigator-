import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, Input, Select, SchemeCard, EmptyState } from '../components';
import { Search } from 'lucide-react';
import { schemeService } from '../services/schemeService';
import { useProfile } from '../contexts/ProfileContext';

const immediateCauseOptions = [
  { label: 'Child Birth', value: 'child birth' },
  { label: 'Graduate', value: 'graduate' },
  { label: 'Farmer', value: 'farmer' },
  { label: 'Employment', value: 'employment' },
  { label: 'Disability', value: 'disability' },
  { label: 'Senior Citizen', value: 'senior citizen' },
  { label: 'Housing', value: 'housing' },
  { label: 'Health', value: 'health' },
  { label: 'Education', value: 'education' },
  { label: 'Women', value: 'women' }
];

const defaultSuggestionTerms = ['child birth', 'graduate', 'farmer', 'employment', 'women', 'senior citizen', 'housing'];

const normalizeText = (value = '') => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const buildProfileDefaults = (profile) => ({
  age: profile?.age ?? 28,
  gender: profile?.gender ?? 'female',
  state: profile?.state ?? 'karnataka',
  income: profile?.income ?? 250000,
  occupation: profile?.occupation ?? 'student',
  ownLand: profile?.ownLand ?? false,
  landholding: profile?.landholding ?? 0,
  disability: profile?.disability ?? false,
  urban: profile?.urban ?? 'urban',
  socialCategory: profile?.socialCategory ?? 'general',
  dependents: profile?.dependents ?? 0,
  children: profile?.children ?? 0,
  lookingForWork: profile?.lookingForWork ?? 'yes'
});

export const FindBenefits = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: profile?.state || '',
    category: '',
    ministry: '',
    cause: '',
    gender: profile?.gender || '',
    occupation: profile?.occupation || '',
    age: profile?.age || '',
    income: profile?.income || ''
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      state: current.state || profile?.state || '',
      gender: current.gender || profile?.gender || '',
      occupation: current.occupation || profile?.occupation || '',
      age: current.age || profile?.age || '',
      income: current.income || profile?.income || ''
    }));
  }, [profile]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: allSchemes } = await schemeService.getSchemes();
      const normalizedQuery = normalizeText(searchQuery);
      const queryTokens = normalizedQuery ? normalizedQuery.split(' ').filter(Boolean) : [];
      const selectedFilters = {
        ...filters,
        state: filters.state || profile?.state || '',
        gender: filters.gender || profile?.gender || '',
        occupation: filters.occupation || profile?.occupation || '',
        age: filters.age || profile?.age || '',
        income: filters.income || profile?.income || ''
      };

      const activeFilters = Object.entries(selectedFilters).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        return String(value).trim() !== '';
      });

      const matchText = (value, target) => {
        if (!target) return true;
        const haystack = normalizeText(value || '');
        const needle = normalizeText(target);
        return haystack.includes(needle) || needle.includes(haystack);
      };

      const schemeScores = allSchemes.map((scheme) => {
        const nameText = normalizeText(scheme.name);
        const searchableText = [
          scheme.name,
          scheme.description,
          scheme.category,
          scheme.ministry,
          scheme.state,
          scheme.immediateCause || '',
          ...(scheme.keywords || []),
          ...(scheme.eligibilityCriteria || []),
          ...(scheme.documents || [])
        ].join(' ');
        const haystack = normalizeText(searchableText);

        let score = 0;

        if (normalizedQuery) {
          if (nameText.includes(normalizedQuery)) score += 28;
          if (haystack.includes(normalizedQuery)) score += 12;
          queryTokens.forEach((token) => {
            if (nameText.includes(token)) score += 10;
            if (haystack.includes(token)) score += 5;
          });
        }

        if (activeFilters.length === 0 && !normalizedQuery) {
          score = 1;
        }

        if (selectedFilters.cause) {
          if (matchText(scheme.immediateCause, selectedFilters.cause)) score += 16;
          if (matchText(scheme.name, selectedFilters.cause)) score += 8;
        }

        if (selectedFilters.category) {
          if (matchText(scheme.category, selectedFilters.category)) score += 12;
        }

        if (selectedFilters.ministry) {
          if (matchText(scheme.ministry, selectedFilters.ministry)) score += 10;
        }

        if (selectedFilters.state) {
          if (matchText(scheme.state, selectedFilters.state) || normalizeText(scheme.state) === 'all india') score += 10;
        }

        if (selectedFilters.gender) {
          const genderMatch = (scheme.eligibilityRules || []).some(rule => rule.field === 'gender' && normalizeText(String(rule.value)) === normalizeText(selectedFilters.gender));
          if (genderMatch || matchText([scheme.name, scheme.description].join(' '), selectedFilters.gender)) score += 8;
        }

        if (selectedFilters.occupation) {
          const occupationMatch = (scheme.eligibilityRules || []).some(rule => rule.field === 'occupation' && normalizeText(String(rule.value)) === normalizeText(selectedFilters.occupation));
          if (occupationMatch || matchText([scheme.name, scheme.description].join(' '), selectedFilters.occupation)) score += 8;
        }

        if (selectedFilters.age) {
          const ageValue = Number(selectedFilters.age);
          const ageRules = (scheme.eligibilityRules || []).filter(rule => rule.field === 'age');
          if (ageRules.length === 0) {
            score += 2;
          } else if (ageRules.some(rule => {
            const threshold = Number(rule.value);
            if (Number.isNaN(threshold)) return false;
            if (rule.operator === '>=' && ageValue >= threshold) return true;
            if (rule.operator === '<=' && ageValue <= threshold) return true;
            if (rule.operator === '>' && ageValue > threshold) return true;
            if (rule.operator === '<' && ageValue < threshold) return true;
            return false;
          })) {
            score += 10;
          }
        }

        if (selectedFilters.income) {
          const incomeValue = Number(selectedFilters.income);
          const incomeRules = (scheme.eligibilityRules || []).filter(rule => rule.field === 'income');
          if (incomeRules.length === 0) {
            score += 2;
          } else if (incomeRules.some(rule => {
            const limit = Number(rule.value);
            if (Number.isNaN(limit)) return false;
            if (rule.operator === '<=' && incomeValue <= limit) return true;
            if (rule.operator === '>=' && incomeValue >= limit) return true;
            if (rule.operator === '<' && incomeValue < limit) return true;
            if (rule.operator === '>' && incomeValue > limit) return true;
            return false;
          })) {
            score += 10;
          }
        }

        return {
          ...scheme,
          matchScore: score,
          scoreBreakdown: {
            query: normalizedQuery,
            filters: activeFilters.length
          }
        };
      });

      let resultsList = schemeScores
        .filter((scheme) => {
          if (!normalizedQuery && activeFilters.length === 0) return true;
          return scheme.matchScore > 0;
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 20);

      if (resultsList.length === 0 && normalizedQuery) {
        resultsList = schemeScores
          .filter((scheme) => {
            const directName = normalizeText(scheme.name);
            const tokens = queryTokens.length ? queryTokens : [normalizedQuery];
            return tokens.some(token => directName.includes(token) || normalizeText(scheme.immediateCause || '').includes(token));
          })
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 8);
      }

      setResults(resultsList);
    } finally {
      setLoading(false);
    }
  };

  const searchSuggestions = (() => {
    const baseList = [...defaultSuggestionTerms];

    if (!results || results.length === 0) {
      const fallbackOptions = (schemeService && typeof schemeService.getSchemes === 'function')
        ? []
        : [];

      return baseList.concat(fallbackOptions);
    }

    return baseList.filter(term => term.toLowerCase().includes(searchQuery.toLowerCase()) || !searchQuery.trim());
  })();

  return (
    <div className="flex min-h-screen w-full bg-[#c9f3ce] text-[#14341e] font-sans selection:bg-[#4ae278] selection:text-[#14341e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Find Benefits" />
        <main className="flex-1 overflow-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-10">
          <div className="w-full">
            <div className="mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#177e4f]">Database</span>
              <h1 className="text-3xl sm:text-4xl font-light text-[#14341e] tracking-tight mt-1">Discover Schemes</h1>
            </div>

            <form onSubmit={handleSearch} className="rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-8 space-y-5 mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Search by scheme name"
                  placeholder="PM-KISAN, scholarship, farmer support..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select
                  label="State Jurisdiction"
                  placeholder="All Territories"
                  value={filters.state}
                  onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                  options={[
                    { label: 'Karnataka', value: 'karnataka' },
                    { label: 'Maharashtra', value: 'maharashtra' },
                    { label: 'Delhi', value: 'delhi' },
                    { label: 'All India', value: 'all india' }
                  ]}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Immediate Cause"
                  placeholder="Any life situation"
                  value={filters.cause}
                  onChange={(e) => setFilters(prev => ({ ...prev, cause: e.target.value }))}
                  options={immediateCauseOptions}
                />
                <Select
                  label="Classification"
                  placeholder="All sectors"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  options={[
                    { label: 'Education & Research', value: 'education' },
                    { label: 'Employment & Skilling', value: 'employment' },
                    { label: 'Agriculture & Agritech', value: 'agriculture' },
                    { label: 'Healthcare', value: 'healthcare' },
                    { label: 'Social Security', value: 'social security' }
                  ]}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Gender"
                  placeholder="Any gender"
                  value={filters.gender}
                  onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                  options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' }
                  ]}
                />
                <Select
                  label="Occupation"
                  placeholder="Any occupation"
                  value={filters.occupation}
                  onChange={(e) => setFilters(prev => ({ ...prev, occupation: e.target.value }))}
                  options={[
                    { label: 'Student', value: 'student' },
                    { label: 'Farmer', value: 'farmer' },
                    { label: 'Salaried', value: 'salaried' },
                    { label: 'Unemployed', value: 'unemployed' },
                    { label: 'Self-employed', value: 'self-employed' }
                  ]}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Ministry / Department"
                  placeholder="All Authorities"
                  value={filters.ministry}
                  onChange={(e) => setFilters(prev => ({ ...prev, ministry: e.target.value }))}
                  options={[
                    { label: 'Education', value: 'education' },
                    { label: 'Labour & Employment', value: 'labour' },
                    { label: 'Agriculture & Farmers Welfare', value: 'agriculture' },
                    { label: 'Women & Child Development', value: 'women' },
                    { label: 'Social Justice', value: 'social justice' }
                  ]}
                />
                <Input
                  label="Age"
                  type="number"
                  placeholder="Any age"
                  value={filters.age}
                  onChange={(e) => setFilters(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Income"
                  type="number"
                  placeholder="Annual income"
                  value={filters.income}
                  onChange={(e) => setFilters(prev => ({ ...prev, income: e.target.value }))}
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#177e4f] text-white text-xs font-normal hover:bg-[#14341e] transition shadow-sm"
              >
                <Search size={14} className="text-[#4ae278]" />
                <span>Search Directives</span>
              </button>
            </form>

            {results === null ? (
              <div className="rounded-2xl bg-white/30 backdrop-blur-sm border border-[#a9c7b1]/40 p-5 text-center">
                <p className="text-xs text-[#14341e]/70 font-light leading-relaxed">
                  Filter and inspect central gazettes and state notifications without registration requirements.
                </p>
              </div>
            ) : loading ? (
              <p className="text-center text-gray-600">Searching schemes…</p>
            ) : results.length === 0 ? (
              <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/70 p-8">
                <div className="mb-4">
                  <p className="text-sm font-medium text-[#14341e]">No exact matches for this search.</p>
                  <p className="text-xs text-[#14341e]/70 mt-1">Try one of these common life situations:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchSuggestions.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term);
                        setFilters(prev => ({ ...prev, cause: term }));
                      }}
                      className="px-3 py-1.5 rounded-full bg-white/70 border border-[#a9c7b1]/40 text-xs text-[#14341e] hover:bg-white transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                <p className="text-sm text-gray-600">{results.length} scheme{results.length === 1 ? '' : 's'} found</p>
                {results.map((scheme) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    eligibility={scheme.eligibility}
                    onViewDetails={() => navigate(`/app/schemes/${scheme.id}`)}
                    onSave={() => schemeService.saveScheme(scheme.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FindBenefits;