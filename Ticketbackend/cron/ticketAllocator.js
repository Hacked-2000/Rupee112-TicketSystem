const cron = require('node-cron');
const {runTicketAllocation}  = require('../controllers/cronController');

// Run every 5 minutes
cron.schedule('*/2 * * * *', async () => {
    // console.log('Running ticket allocation cron job...0');
    await runTicketAllocation();
    console.log('Running ticket allocation cron job...');
});
console.log('Ticket allocation cron job scheduled to run every 5 minutes.');