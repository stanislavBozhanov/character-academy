import React, { useEffect, useState } from 'react';
import { serverRoutes } from '../services/routes';
import { handledFetch, fetchGet } from '../services/utils';

export const Test = () => {
  const [data, setData] = useState(null);

  const getData = async () => {
    try {
      const response = await fetchGet(serverRoutes.test);
      const jsonData = await response.json();
      setData(JSON.stringify(jsonData));
    } catch (error) {
      setData(error);
    }
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
