import { verifyUsername } from "../src/lib/Verify";

function testUsernameValidator() {
    const usernames = [
        "john_doe", // valid
        "alice123", // valid
        "bob-smith", // valid
        "user_001", // valid
        "test1234", // valid
        "valid-username", // valid
        "username_!@#", // invalid (contains special characters)
        "invalid username", // invalid (contains a space)
        "-leading-hyphen", // valid
        "trailing-hyphen-", // invalid length > 15
        "double--hyphen", // valid
        "123456", // valid
        "_underscore", // valid
        "too$pecialChars", // invalid (contains a special character)
        "upperCASE123", // valid
        "lowercaseabc", // valid
        "Invalid_Username!", // invalid (contains an exclamation mark)
    ];
    usernames.forEach((username) => verifyUsername(username));
}
// comment in to test
// testUsernameValidator()
