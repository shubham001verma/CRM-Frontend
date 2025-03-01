import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab } from '@mui/material';
import { IconArrowUpLeft, IconCurrencyDollar } from '@tabler/icons';
import DashboardCard from '../../shared/DashboardCard';
import API_BASE_URL from "../../Config";

const MonthlyEarnings = () => {
    const userId = sessionStorage.getItem('useridsrmapp');
    const [monthlyEarnings, setMonthlyEarnings] = useState(0);
    const [monthlyData, setMonthlyData] = useState(Array(12).fill(0)); 

    const theme = useTheme();
    const secondary = theme.palette.secondary.main;
    const secondarylight = theme.palette.secondary.light;
    const successlight = theme.palette.success.light;

    const fetchEarnings = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/client/getclientsbyuserid/${userId}`);
            const data = response.data.data;

            let earningsByMonth = Array(12).fill(0); 

            data.forEach(client => {
                const earnings = client.paymentReceived || 0;
                const clientMonth = new Date(client.createdAt).getMonth(); 
                earningsByMonth[clientMonth] +=+ earnings;
            });

            const currentMonth = new Date().getMonth();
            setMonthlyEarnings(earningsByMonth[currentMonth]); 
            setMonthlyData(earningsByMonth); 
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        fetchEarnings();
    }, []);

    const optionscolumnchart = {
        chart: {
            type: 'area',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: false,
            },
            height: 60,
            sparkline: {
                enabled: true,
            },
            group: 'sparklines',
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        fill: {
            colors: [secondarylight],
            type: 'solid',
            opacity: 0.05,
        },
        markers: {
            size: 0,
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            x: {
                show: false,
            }
        },
    };

    const seriescolumnchart = [
        {
            name: 'Monthly Earnings',
            color: secondary,
            data: monthlyData, 
        },
    ];

    return (
        <DashboardCard
            title="Monthly Earnings"
            action={
                <Fab color="secondary" size="medium">
                    <IconCurrencyDollar width={24} />
                </Fab>
            }
            footer={
                <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height="60px" />
            }
        >
            <Typography variant="h3" fontWeight="700" mt="-20px">
                ₹{monthlyEarnings}
            </Typography>
            <Stack direction="row" spacing={1} my={1} alignItems="center">
                <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
                    <IconArrowUpLeft width={20} color="#39B69A" />
                </Avatar>
                <Typography variant="subtitle2" fontWeight="600">
                    +9%
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                    last year
                </Typography>
            </Stack>
        </DashboardCard>
    );
};

export default MonthlyEarnings;
