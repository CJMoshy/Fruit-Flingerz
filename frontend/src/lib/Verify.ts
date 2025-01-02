const RE = new RegExp("^[a-zA-Z0-9_-]+$");
const MAX_USERNAME_LENGTH = 15;

export function verifyUsername(prospect: string): boolean {
    prospect.trim();
    // check against regex to assert only aphanumerics, underscores and hyphens
    if (prospect.match(RE) === null) {
        alert(
            `invalid username ${prospect}. Username must only contain alphanumerics, underscores and hyphens`,
        );
        return false;
    }
    // check max length
    if (prospect.length > MAX_USERNAME_LENGTH) {
        alert(
            `invlalid username length of ${prospect.length}. Username must have max length of 15 characters`,
        );
        return false;
    }
    console.log("valid username", prospect);
    return true;
}
