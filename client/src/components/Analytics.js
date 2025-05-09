import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material';

import { 
  getQueryAnalytics, 
  getCitationAnalytics, 
  getUserEngagementMetrics 
} from '../services/analyticsService';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [queryData, setQueryData] = useState(null);
  const [citationData, setCitationData] = useState(null);
  const [engagementData, setEngagementData] = useState(null);

  // Use useMemo for derived calculations to prevent unnecessary recalculations
  const maxCategoryCount = useMemo(() => {
    if (!queryData?.topCategories) return 0;
    return Math.max(...queryData.topCategories.map(c => c.count));
  }, [queryData?.topCategories]);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Fetch all analytics data in parallel
        const [queries, citations, engagement] = await Promise.all([
          getQueryAnalytics({ timeRange }),
          getCitationAnalytics({ timeRange }),
          getUserEngagementMetrics()
        ]);
        
        if (isMounted) {
          setQueryData(queries);
          setCitationData(citations);
          setEngagementData(engagement);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchAnalyticsData();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [timeRange]);
  
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const MetricCard = ({ title, value, subtitle }) => (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Analytics Dashboard
        </Typography>
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="time-range-select-label">Time Range</InputLabel>
          <Select
            labelId="time-range-select-label"
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
            size="small"
          >
            <MenuItem value="day">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Overview Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Total Queries" 
            value={queryData?.totalQueries.toLocaleString()} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Total Citations" 
            value={citationData?.totalCitations.toLocaleString()} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Active Users" 
            value={engagementData?.activeUsers.toLocaleString()} 
            subtitle={`of ${engagementData?.totalUsers.toLocaleString()} total users`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Avg. Session Duration" 
            value={`${engagementData?.averageSessionDuration} min`} 
          />
        </Grid>
      </Grid>

      {/* Query Analytics */}
      <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
        Query Analytics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Query Volume Over Time
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {queryData?.queriesTimeline.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell component="th" scope="row">{row.date}</TableCell>
                      <TableCell align="right">{row.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Query Categories
            </Typography>
            <Box sx={{ mt: 2 }}>
              {queryData?.topCategories.map((category) => (
                <Box key={category.category} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{category.category}</Typography>
                    <Typography variant="body2">{category.count}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(category.count / maxCategoryCount) * 100} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Citation Analytics */}
      <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
        Citation Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Cited Acts
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Act</TableCell>
                    <TableCell align="right">Citations</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {citationData?.topCitedActs.map((row) => (
                    <TableRow key={row.act}>
                      <TableCell component="th" scope="row">{row.act}</TableCell>
                      <TableCell align="right">{row.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Cited Sections
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Section</TableCell>
                    <TableCell align="right">Citations</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {citationData?.topCitedSections.map((row) => (
                    <TableRow key={row.section}>
                      <TableCell component="th" scope="row">{row.section}</TableCell>
                      <TableCell align="right">{row.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* User Engagement */}
      <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
        User Engagement
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Device Distribution
            </Typography>
            <Box sx={{ mt: 2 }}>
              {engagementData?.deviceDistribution.map((device) => (
                <Box key={device.device} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{device.device}</Typography>
                    <Typography variant="body2">{device.percentage}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={device.percentage} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              User Satisfaction Metrics
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Satisfaction Score
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4361ee' }}>
                    {engagementData?.userSatisfactionScore}/5
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Completion Rate
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4361ee' }}>
                    {(engagementData?.queryCompletionRate * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Return Rate
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4361ee' }}>
                    {(engagementData?.returningUsers / engagementData?.totalUsers * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Bounce Rate
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f72585' }}>
                    {(engagementData?.bounceRate * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          For enhanced visualizations, please install the recharts library:
          <br />
          <code>npm install recharts</code> or <code>yarn add recharts</code>
        </Typography>
      </Box>
    </Box>
  );
};

export default Analytics;
