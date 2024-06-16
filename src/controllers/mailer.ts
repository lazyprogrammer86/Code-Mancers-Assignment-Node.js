import nodeMailer from 'nodemailer';

let transporter: any;

export function intializeMailer (){
    try{
        transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PROT,
            secure: process.env.SECRURE == 'true' ? true : false,
            secureConnection: false,
            auth:{
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        } as nodeMailer.TransportOptions);

        transporter.verify((err:any, Success: boolean)=> {
            if(err){
                console.log('Connection to SMTP server failed');
                console.log(err);   
                process.emit('SIGINT');
            }else{
                console.log('Mail Service Initialized');
            }
        });
        return true;
    }catch(error: any){
        console.log('Error while initializing mailer');
        console.log(error);
        return false;
    }
}

export async function sendMail(to: toEmail[], cc: string[], bcc: string[], subject: string, message: string = '', html: string = '', attachments:attachemnt[] = []): Promise<functionResponse | boolean>{
    try{
        for(let {email, name} of to){
            try{
               await transporter.sendMail({
                    from: process.env.SMTP_USER,
                    to: email,
                    subject: subject,
                    text: message,
                    html: html,
                    attachments: attachments
               });
               console.log(`Successfully sent email to user: ${name}, with email: ${email}`)
            }catch(error: any){
                console.log(`Error while sending email to user: ${name} with email: ${email}`);
                console.log(error);
            }
        }
        return {code: 1, msg: 'Success'};
    }catch(error: any){
        console.log('Error while sending mail');
        console.log(error);
        return {code : -1, msg: 'Faield', info: error.message};
    }
}