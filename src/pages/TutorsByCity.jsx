import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import TutorCard from '../components/shared/TutorCard';
import SEO from '../components/shared/SEO';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const formatCity = (slug) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const TutorsByCity = () => {
  const { city } = useParams();
  const cityName = formatCity(city);

  const { data: tutors = [], isLoading: loading } = useQuery({
    queryKey: ['tutors', 'city', city],
    queryFn: async () => {
      const res = await api.get(`/api/tutors?location=${encodeURIComponent(cityName)}`);
      return res.data?.data ?? res.data ?? [];
    },
    staleTime: 120_000,
  });

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <SEO title={`Private tutors in ${cityName} | eTuitionBD`} description={`Find verified private tutors in ${cityName} for SSC, HSC, O-Level, A-Level, IELTS and admission prep.`} />
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Private tutors in {cityName}</h1>
        <p className="text-muted-foreground mt-2">{loading ? 'Loading…' : `${tutors.length} tutor${tutors.length === 1 ? '' : 's'} available`}</p>
      </header>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <LoadingSpinner /> : tutors.length === 0 ? <p>No tutors in {cityName} yet — check back soon.</p> : tutors.map((t) => <TutorCard key={t._id} tutor={t} />)}
      </div>
    </div>
  );
};

export default TutorsByCity;
