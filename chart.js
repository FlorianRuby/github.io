async function renderChart() {
    try {
        const response = await fetch('last_week_tracks.json');
        const tracks = await response.json();

        const playCounts = {};
        const labels = [];

        
        tracks.forEach(track => {
            const trackDate = new Date(track.date['#text']).toLocaleDateString(); 
            playCounts[trackDate] = (playCounts[trackDate] || 0) + 1; 
        });

        
        for (const [date, count] of Object.entries(playCounts)) {
            labels.push(date); 
        }

        const data = {
            labels: labels,
            datasets: [{
                label: 'Plays Over the Last Week',
                data: Object.values(playCounts), 
                backgroundColor: 'rgba(142, 141, 190, 0.00)',
                borderColor: 'rgba(142, 141, 190, 1)',
                borderWidth: 2, 
                fill: true, 
                pointRadius: 0, 
                tension: 0.3 
            }]
        };

        const config = {
            type: 'line', 
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false, 
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false 
                        }
                    },
                    x: {
                        grid: {
                            display: false 
                        },
                        reverse: true 
                    }
                },
                plugins: {
                    legend: {
                        display: false 
                    },
                    tooltip: {
                        enabled: true 
                    }
                },
                hover: {
                    mode: 'nearest',
                    intersect: true,
                    onHover: function(event, chartElement) {
                        const chartArea = this.chart.chartArea;
                        const ctx = this.chart.ctx;

                        
                        if (chartElement.length) {
                            ctx.save();
                            ctx.fillStyle = 'rgba(128, 0, 128, 0.5)'; 
                            ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
                            ctx.restore();
                        }
                    }
                }
            }
        };

        const playsChart = new Chart(
            document.getElementById('playsChart'),
            config
        );
        
        
        const musicBox = document.getElementById('box-lastfm');
        const chartInstance = playsChart;
        
        musicBox.addEventListener('mouseenter', () => {
            
            chartInstance.data.datasets[0].backgroundColor = 'rgba(142, 141, 190, 0.4)';
            chartInstance.update();
        });
        
        musicBox.addEventListener('mouseleave', () => {
            
            chartInstance.data.datasets[0].backgroundColor = 'rgba(142, 141, 190, 0.00)';
            chartInstance.update();
        });
        
    } catch (error) {
        console.error('Error rendering chart:', error);
    }
}


renderChart(); 