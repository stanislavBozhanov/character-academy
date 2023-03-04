import React, { useEffect, useState } from 'react';
import { serverRoutes } from '../services/routes';
import { handledFetch } from '../services/utils';

export const Test = () => {
  const [data, setData] = useState(null);

  const getData = async () => {
    const [data, error] = await handledFetch(serverRoutes.test, { method: 'GET' });
    console.log('data', data);
    console.log('error', error);
    if (!error) {
      const jsonData = await data.json();
      setData(JSON.stringify(jsonData));
      return;
    }
    setData('Error in fetching!');
  };

  useEffect(() => {
    getData();
  }, []);

  if (!data) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <pre>{data}</pre>
    </div>
  );
};
