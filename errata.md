Security fix: 2017/09/03
------------------------
 1. Error type
    SQL injection vulnerability
 2. Affected versions
    v0.0.2 and below are affected.
 3. Vulnerability
    Input fields on the /admin* routes were not previously being
    validated, allowing for arbitrary values to be submitted. These raw
    values were picked from the request body and used to directly
    compose mysql queries which were immediately executed.
 4. Patch (Commit 48efebe)
    Unformatted inputs are validated against character blacklists, while
    formatted inputs are validated to match expected patterns (ex. date
    strings, etc.) using validator.js.
 5. Credit
    This issue was identified by the University of Guelph CIS Security
    team and fixed by [Keefer Rourke](https://github.com/keeferrourke)
