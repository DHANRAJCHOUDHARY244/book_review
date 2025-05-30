import { CustomEmailContent, OtpContentData } from "@constants/common.interface"

export const greetingContent = (email:string) => {
    return `
    <p style="line-height: 160%;"><span
    style="font-size: 20px; line-height: 32px; color: #f1c40f;"><strong>Hii Buddy
        ${email}</strong></span></p>
    <p style="line-height: 160%;"> </p>
    <p style="line-height: 160%;"><span
        style="font-size: 16px; line-height: 25.6px;"><strong>
    `
}

export const registrationContent = (email:string) => {
    return greetingContent(email) + `<span
    style="line-height: 22.4px;">Welcome to our Family
    Family!</span></strong ></span ></p >
    <p style="line-height: 160%;"> </p>
    <p style="line-height: 160%; text-align: left;"><span
        style="font-size: 14px; line-height: 22.4px;">You are successfully registered and
        Your account is Activated now enjoy our services. </span></p>
    <p style="line-height: 160%;"> </p>`
}


export const otpContent = (email:string, content:OtpContentData) => {
    return greetingContent(email) + `   <p style="line-height: 160%;"><span
    style="font-size: 16px; line-height: 25.6px;"><strong><span
        style="line-height: 22.4px;">${content.title}</span></strong></span></p>
    <p style="line-height: 160%;"> </p>
    <p style="line-height: 160%;"><span
        style="font-size: 14px; line-height: 22.4px;"><span
            style="line-height: 22.4px;">Your otp is <span
                style="color: #e03e2d; line-height: 22.4px;"><strong><span
                    style="font-size: 20px; line-height: 32px;">${content.otp}</span></strong></span>.</span></span>
    </p>
    <p style="line-height: 160%;"><span
        style="font-size: 14px; line-height: 22.4px;"><span
            style="line-height: 22.4px;">Stay Safe !</span></span></p>
`
}

export function customContent (email:string, content:CustomEmailContent){
    return greetingContent(email) + `<span
    style="line-height: 22.4px;"> ${content.title} </span></strong ></span ></p >
    <p style="line-height: 160%;"> </p>
    <p style="line-height: 160%; text-align: left;"><span
        style="font-size: 14px; line-height: 22.4px;">${content.description} </span></p>
    <p style="line-height: 160%;"> </p>`
}
