const TicketModel = require('../models/cronModel');

const userIds = [33, 2,3];
const MAX_TICKETS_PER_USER = 100;
const MAX_ALLOCATION_PER_RUN = 10;

exports.runTicketAllocation = async () => {
    try {
        const openTickets = await TicketModel.getOpenTickets();
        if (openTickets.length === 0) return console.log('No open tickets found.');

        const ticketsToAllocate = [...openTickets]; // clone
        const totalTickets = ticketsToAllocate.length;
        console.log({ticketsToAllocate});
        console.log(`Total open tickets found: ${totalTickets}`);

        // Calculate how many users can still receive tickets
        const eligibleUsers = [];

        for (const userId of userIds) {
            const currentCount = await TicketModel.getInProgressTicketCount(userId);
            const remaining = MAX_TICKETS_PER_USER - currentCount;

            if (remaining > 0) {
                eligibleUsers.push({
                    userId,
                    availableSlots: Math.min(remaining, MAX_ALLOCATION_PER_RUN)
                });
            }
        }

        const totalSlots = eligibleUsers.reduce((sum, user) => sum + user.availableSlots, 0);
        if (totalSlots === 0) return console.log('No eligible users to allocate tickets.');

        // Calculate equal distribution
        const ticketsPerUser = Math.floor(totalTickets / eligibleUsers.length);
        const remainingTickets = totalTickets % eligibleUsers.length;

        // Distribute tickets equally
        // for (const user of eligibleUsers) {
        //     const count = Math.min(ticketsPerUser, user.availableSlots, ticketsToAllocate.length);
        //     const ticketIds = ticketsToAllocate.splice(0, count).map(t => t.id);
        //     await TicketModel.allocateTickets(ticketIds, user.userId);
        //     console.log(`Allocated ${ticketIds.length} tickets to user ${user.userId}`);
        // }
        // Distribute tickets one-by-one to eligible users until tickets are exhausted
for (const user of eligibleUsers) {
    if (ticketsToAllocate.length === 0) break;

    const allocatableCount = Math.min(user.availableSlots, ticketsToAllocate.length);
    const ticketIds = ticketsToAllocate.splice(0, allocatableCount).map(t => t.id);

    if (ticketIds.length > 0) {
        await TicketModel.allocateTickets(ticketIds, user.userId);
        console.log(`Allocated ${ticketIds.length} tickets to user ${user.userId}`);
    }
}


        // Handle remaining tickets in another cron run
        if (remainingTickets > 0) {
            console.log(`Remaining tickets to be allocated in the next run: ${remainingTickets}`);
        }

    } catch (err) {
        console.error('Cron job allocation error:', err);
    }
};
