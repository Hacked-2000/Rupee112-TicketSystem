import TicketReply from "../Components/TMS/openTicket";

export const apiUrls={

    Login:'/api/v1/login',
    ProtectedLogin: '/api/v1/protected',
    UserList: '/api/v1/users?page=1&limit=25',
    CreateUser: '/api/v1/users',
    UpdateUser: '/api/v1//users',
    DeleteUser: '/api/v1/users',
    MasterRole: '/api/v1/roles',
    CreateTicket: '/api/v2/tickets',
    TicketList: '/api/v2/tickets',
    TicketReply: '/v2/tickets/${ticket_id}/replies',
};