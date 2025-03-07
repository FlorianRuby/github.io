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
                backgroundColor: 'rgba(142, 141, 190, 0.0)',
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
                }
            }
        };

        const playsChart = new Chart(
            document.getElementById('listening-chart'),
            config
        );
        
        // Add hover effects
        const musicBox = document.getElementById('box-lastfm');
        
        musicBox.addEventListener('mouseenter', () => {
            playsChart.data.datasets[0].backgroundColor = 'rgba(142, 141, 190, 0.2)';
            playsChart.update('none'); // Use 'none' for smoother transition
        });
        
        musicBox.addEventListener('mouseleave', () => {
            playsChart.data.datasets[0].backgroundColor = 'rgba(142, 141, 190, 0.0)';
            playsChart.update('none'); // Use 'none' for smoother transition
        });
        
    } catch (error) {
        console.error('Error rendering chart:', error);
    }
}

renderChart(); 