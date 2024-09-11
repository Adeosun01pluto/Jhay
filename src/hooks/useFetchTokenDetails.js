// const fetchTokenDetails = async () => {
//     setLoading(true);
//     try {
//       const rapidApiKey = import.meta.env.VITE_RAPID_API_KEY;
//       const options = {
//         method: 'GET',
//         url: `https://coinranking1.p.rapidapi.com/coin/${id}`,
//         params: { referenceCurrencyUuid: 'yhjMzLPhuIDl', timePeriod: '24h' },
//         headers: {
//           'x-rapidapi-key': rapidApiKey,
//           'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
//         }
//       };

//       const response = await axios.request(options);
//       setToken(response.data.data.coin);
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//       setError('Failed to fetch token details. Please try again later.');
//       setLoading(false);
//     }
//   };