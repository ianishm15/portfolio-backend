import {
  Server,
} from "socket.io";

/* -------------------------------- */
/* Initialize Socket.IO             */
/* -------------------------------- */

const initializeSocket =
  (httpServer) => {

    const io =
      new Server(

        httpServer,

        {

          cors: {

            origin:
              process.env.FRONTEND_URL,

            credentials: true,

          },

        }

      );

    /* ---------------------------- */
    /* Connection                   */
    /* ---------------------------- */

    io.on(

      "connection",

      (socket) => {

        console.log(

          "User Connected:",

          socket.id

        );

        /* ------------------------ */
        /* Disconnect               */
        /* ------------------------ */

        socket.on(

          "disconnect",

          () => {

            console.log(

              "User Disconnected:",

              socket.id

            );

          }

        );

      }

    );

    return io;

  };

export default
  initializeSocket;