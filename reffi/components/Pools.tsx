"use client";
import React, { useEffect, useState } from "react";
import PoolData from "./PoolData";
import { AreaChartData } from "./AreaChart";

const Pools = () => {
  const [data, setData] = useState([]);
  const getPools = async () => {
    try {
      const pools = await fetch("https://api.ref.finance/list-top-pools");
      const data = await pools.json();

      // Filter pools to only include those with wNEAR in token_symbols
      const filteredPools = data.filter(pool  => {
        return pool.token_symbols.includes("wNEAR");
      });

      console.log(filteredPools, "Filtered Pools");
      setData(filteredPools); // Update state with filtered pools
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPools();
  }, []);

  return (
    <div>
      <div className="sm:max-w-5xl max-w-sm mx-auto">{/* Chart */}</div>
      {/* Pools */}
      <PoolData data={data} />
    </div>
  );
};

export default Pools;
