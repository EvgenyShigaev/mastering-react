import { useState, useEffect } from 'react';
import './App.css';
import Preloader from './preloader/Preloader';

async function getCharacters(name, page = 1, options = {}) {
  return await fetch(
    `https://rickandmortyapi.com/api/character?name=${name}&page=${page}`,
    options
  ).then((res) => res.json());
}

function App() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getCharacters(value);
        if (res.error) {
          throw new Error(res.error);
        }
        setResult(res.results);
        setError(null);
      } catch (err) {
        setError(err.message);
        setResult([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (value.trim().length > 0) {
      fetchData();
    } else {
      setResult([]);
      setError(null);
    }
  }, [value]);

  const searchNames = (e) => setValue(e.target.value);
  const names = result.map((person) => <li key={person.id}>{person.name}</li>);

  return (
    <>
      {isLoading && <Preloader />}
      <input onChange={searchNames} />
      {error ? <p>{error}</p> : <ul>{names}</ul>}
    </>
  );
}

export default App;
