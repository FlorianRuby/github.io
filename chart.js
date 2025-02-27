async function renderChart() {
    try {
        const response = await fetch('last_week_tracks.json');
        const tracks = await response.json();

        const playCounts = {};
        const labels = [];

        // Count plays for each track by date
        tracks.forEach(track => {
            const trackDate = new Date(track.date['#text']).toLocaleDateString(); // Format date
            playCounts[trackDate] = (playCounts[trackDate] || 0) + 1; // Increment play count for the date
        });

        // Prepare data for the chart
        for (const [date, count] of Object.entries(playCounts)) {
            labels.push(date); // Add date to labels
        }

        const data = {
            labels: labels,
            datasets: [{
                label: 'Plays Over the Last Week',
                data: Object.values(playCounts), // Use the counts for each date
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2, // Adjust line width
                fill: false, // Disable filling under the line
                pointRadius: 0, // Remove points for a cleaner look
                tension: 0.3 // Increase curvature (0 = straight, 1 = very curved)
            }]
        };

        const config = {
            type: 'line', // Change to line graph
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allow custom height
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false // Disable grid lines
                        }
                    },
                    x: {
                        grid: {
                            display: false // Disable grid lines
                        },
                        reverse: true // Reverse the x-axis to show the most recent date on the right
                    }
                },
                plugins: {
                    legend: {
                        display: false // Hide legend for a minimal look
                    },
                    tooltip: {
                        enabled: true // Enable tooltips
                    }
                },
                hover: {
                    mode: 'nearest',
                    intersect: true,
                    onHover: function(event, chartElement) {
                        const chartArea = this.chart.chartArea;
                        const ctx = this.chart.ctx;

                        // Fill the entire chart area on hover
                        if (chartElement.length) {
                            ctx.save();
                            ctx.fillStyle = 'rgba(75, 192, 192, 0.5)'; // Fill color
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
    } catch (error) {
        console.error('Error rendering chart:', error);
    }
}

// Call the function to render the chart
renderChart(); 