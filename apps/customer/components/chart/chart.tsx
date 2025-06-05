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
      type: 'areaspline',
      height: 300,
      style: {
        fontFamily: 'Reddit_Sans, sans-serif',
      },
      backgroundColor: 'transparent',
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
      gridLineDashStyle: 'Dot',
      gridLineColor: 'rgba(251, 191, 36, 0.2)',
    },
    series: [
      {
        name: 'Price',
        type: 'spline',
        data: [
          { y: 39000, marker: { fillColor: '#f59e0b' } },
          { y: 37500, marker: { fillColor: '#f59e0b' } },
          { y: 39000, marker: { fillColor: '#f59e0b' } },
          { y: 39000, marker: { fillColor: '#f59e0b' } },
        ],
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, 'rgba(251, 191, 36, 0.6)'],
            [1, 'rgba(251, 191, 36, 0.1)'],
          ],
        },
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, 'rgba(251, 191, 36, 0.3)'],
            [1, 'rgba(251, 191, 36, 0.0)'],
          ],
        },
        lineWidth: 3,
        marker: {
          enabled: true,
          radius: 6,
          symbol: 'circle',
          lineWidth: 2,
          lineColor: '#ffffff',
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
    <div className="w-full h-full">
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        containerProps={{ style: { width: '100%', height: '100%' } }}
      />
    </div>
  );
};

export default PriceHistoryChart;
