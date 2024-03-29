const EXPRIRES_TOKEN = 2;   // days
export const COOKIE_USER = "student_management_admin";

export function setCookie(name: string, value: string, days = EXPRIRES_TOKEN): void {
	let expires = "";
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}
	console.log("exp: ", days);
	
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name:string):string | null {
	const nameEQ = name + "=";
	const ca = document.cookie.split(";");
	
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

export function removeCookie(name:string):void {
	setCookie(name, "", -1);
}