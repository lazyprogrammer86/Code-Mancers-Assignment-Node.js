import {sendMail} from './mailer';

export async function sendOrderMail(email: toEmail, orders: cartResponse[], totalPrice: number): Promise<functionResponse>{
    try{
        let htmlBody = `
            <div>
                <h3>Dear ${email.name},</h3>

                Order for the following items has been placed
                <br/>
                <br/>
                <table style="border: 1px solid black;">
                    <tr style="border: 1px solid black;">
                        <th style="border: 1px solid black;">
                            Product Name
                        </th>
                        <th style="border: 1px solid black;">
                            Product Description
                        </th>
                        <th style="border: 1px solid black;">
                            Product Price
                        </th>
                        <th style="border: 1px solid black;">
                            Product Quantity
                        </th>
                        <th style="border: 1px solid black;">
                            Total Product Price
                        </th>
                    </tr>
                    TABLE_CONTENT
                </table>
                

                <br/>
                <p> The total price of the order is <b>${totalPrice}</p>


                <p style="margin-bottom: 0px;">Thanks And Regards</p>
                <h4 style="margin-top: 2px;">E-commerce Team</h4>
            </div>
        `;

        let tableData = '';

        for(let item of orders){
            tableData += `<tr style="border: 1px solid black;">
                <td style="border: 1px solid black;">${item.title}</td>
                <td style="border: 1px solid black;">${item.description}</td>
                <td style="border: 1px solid black;">${item.price}</td>
                <td style="border: 1px solid black;">${item.count}</td>
                <td style="border: 1px solid black;">${item.count * item.price}</td>
            </tr>`;
        }

        htmlBody = htmlBody.replace(/TABLE_CONTENT/g, tableData);
        let response = await sendMail([email],[],[],'Order has been placed', '',htmlBody);
        return {code: 1, msg: 'Success', info: response};
    }catch(error: any){
        console.log('Error while sending order email');
        console.log(error);
        return {code: -1, msg: 'Failed', info: error.message};
    }
}

export async function sendUserCreation(body: RegistrationBody): Promise<functionResponse>{
    try{

        let htmlBody = `
            <div>
                <h3>Dear ${body.username},</h3>

                Your account has been created with us.
                <br/>
                <h4 style="margin-bottom:0px">Please find the details below</h4>

                <divstyle="margin-top:5px">
                    <span>Email: <b>${body.email}</b></span>
                    <br/>
                    <span>Username: <b>${body.username}</b></span>
                </div>

                <p style="margin-bottom: 0px;">Thanks And Regards</p>
                <h4 style="margin-top: 2px;">E-commerce Team</h4>
            </div>
        `;

        let response = await sendMail([{email: body.email, name: body.username}],[],[],'Your account has been created', '',htmlBody);
        return {code: 1, msg: 'Success', info: response};
    }catch(error: any){
        console.log('Error while sending user creation email');
        console.log(error);
        return {code: -1, msg: 'Failed', info: error.message}; 
    }
}