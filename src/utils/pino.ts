import pino from 'pino';

const logger = pino({
    base: {
        processTitle: `PTitle:- ${process.title}`,
        processId: `P_ID:- ${process.pid}`
    },
    transport: {
        targets: [
            //  -------------------------------- save logs in file
            // {
            //     target: 'pino-pretty',
            //     options: {
            //         destination: './logs/output.log',
            //         mkdir: true,
            //         colorize: false,
            //         include: "processTitle,processId,hostname,time,level",
            //         translateTime: "SYS: 'Date' dd/mm/yy HH:MM:ss",
            //     }
            // },
            {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:dd/mm/yy HH:MM:ss',
                    include: 'pid,hostname,time,level',

                },
            },
        ],
    }
})

export default logger;