export function removeCSSClass(ele:any, cls:any) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
}

export function addCSSClass(ele:any, cls:any) {
    ele.classList.add(cls);
}

export const toAbsoluteUrl = (pathname:any) => process.env.PUBLIC_URL + pathname;
