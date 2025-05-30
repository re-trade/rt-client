'use client';

import Highcharts from 'highcharts';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const HighchartsReact = dynamic(() => import('highcharts-react-official'), {
  ssr: false,
});

const PriceHistoryChart: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'spline',
      height: 300,
      width: 822,
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: ['22-04-2025', '24-04-2025', '05-05-2025', '26-05-2025'],
      labels: {
        style: {
          color: '#666666',
          fontSize: '11px',
          fontFamily: 'Inter, "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
        },
      },
      lineColor: '#ccd6eb',
      tickWidth: 0,
    },
    yAxis: {
      title: {
        text: '',
      },
      gridLineColor: '#e6e6e6',
      labels: {
        format: '{value}k',
        style: {
          color: '#666666',
          fontSize: '11px',
          fontFamily: 'Inter, "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
        },
      },
      min: 0,
      max: 50000,
      tickInterval: 10000,
    },
    series: [
      {
        name: 'Price',
        type: 'spline',
        data: [
          { y: 39000, marker: { fillColor: '#EB5757' } },
          { y: 37500, marker: { fillColor: '#27AE60' } },
          { y: 39000, marker: { fillColor: '#BDBDBD' } },
          { y: 39000, marker: { fillColor: '#BDBDBD' } },
        ],
        color: '#BDBDBD',
        lineWidth: 2,
        marker: {
          enabled: true,
          radius: 4,
        },
      },
    ],
    tooltip: {
      useHTML: true,
      formatter: function () {
        const isHigh = this.y === 39000 && this.x === 0;
        const isLow = this.y === 37500;
        const label = isHigh ? 'Cao nhất' : isLow ? 'Thấp nhất' : 'Giá';
        const className = isHigh
          ? 'beecost-chart-tooltip-price__high'
          : isLow
            ? 'beecost-chart-tooltip-price__low'
            : '';

        return `
          <div class="beecost-chart-tooltip">
            <div class="beecost-chart-tooltip-price ${className}">
              <p>${label} ${this.x}</p>
              <strong>${this.y?.toLocaleString('vi-VN')} ₫</strong>
            </div>
          </div>
        `;
      },
    },
  };

  return (
    <div className="w-full max-w-3xl pt-4">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default PriceHistoryChart;
