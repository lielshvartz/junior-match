useEffect(() => {
    async function loadMatches() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        console.log('Logged in user ID:', user?.id);
        if (!user) return;

        const res = await supabase
          .from('matches')
          .select(`
            id,
            job_id,
            is_liked,
            jobs (
              id,
              title,
              company
            )
          `)
          .eq('user_id', user.id)
          .eq('is_liked', true);

        console.log('Query result:', res);

        if (res.error) throw res.error;
        setMutuals(res.data || []);
      } catch (err) {
        console.error('Error loading matches:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);