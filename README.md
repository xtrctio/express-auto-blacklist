# express-auto-blacklist
Automatically blacklist IPs based on request patterns

Use:
```javascript
const AutoBlacklist = require('@xtrctio/auto-blacklist');

const autoBlacklist = new AutoBlacklist([/some-blacklist-url/]);
app.use(autoBlacklist.check);
```

<a name="AutoBlacklist"></a>

## AutoBlacklist
**Kind**: global class  

* [AutoBlacklist](#AutoBlacklist)
    * [new AutoBlacklist([blockPatterns], [maxStrikes], [strikeAgeMs], [maxBlockedIPs], [whitelist], [blacklist])](#new_AutoBlacklist_new)
    * [.check(req, res, next)](#AutoBlacklist+check) ⇒ <code>\*</code>
    * [.block(ip)](#AutoBlacklist+block) ⇒ <code>void</code>
    * [.strike(ip)](#AutoBlacklist+strike) ⇒ <code>boolean</code>
    * [.whitelistIP(ip)](#AutoBlacklist+whitelistIP) ⇒ <code>void</code>
    * [.blacklistIP(ip)](#AutoBlacklist+blacklistIP) ⇒ <code>void</code>
    * [.isBlocked(ip, path)](#AutoBlacklist+isBlocked) ⇒ <code>boolean</code>

<a name="new_AutoBlacklist_new"></a>

### new AutoBlacklist([blockPatterns], [maxStrikes], [strikeAgeMs], [maxBlockedIPs], [whitelist], [blacklist])

| Param | Type | Default |
| --- | --- | --- |
| [blockPatterns] | <code>Array.&lt;RegExp&gt;</code> | <code>[]</code> | 
| [maxStrikes] | <code>number</code> | <code>2</code> | 
| [strikeAgeMs] | <code>number</code> | <code>(1000 * 60 * 5)</code> | 
| [maxBlockedIPs] | <code>number</code> | <code>100000</code> | 
| [whitelist] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | 
| [blacklist] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | 

<a name="AutoBlacklist+check"></a>

### autoBlacklist.check(req, res, next) ⇒ <code>\*</code>
Check if request should be blocked

**Kind**: instance method of [<code>AutoBlacklist</code>](#AutoBlacklist)  

| Param | Type |
| --- | --- |
| req | <code>Request</code> | 
| res | <code>Response</code> | 
| next | <code>function</code> | 

<a name="AutoBlacklist+block"></a>

### autoBlacklist.block(ip) ⇒ <code>void</code>
Add IP to the LRU blocklist

**Kind**: instance method of [<code>AutoBlacklist</code>](#AutoBlacklist)  

| Param | Type |
| --- | --- |
| ip | <code>string</code> | 

<a name="AutoBlacklist+strike"></a>

### autoBlacklist.strike(ip) ⇒ <code>boolean</code>
Apply strike to IP

**Kind**: instance method of [<code>AutoBlacklist</code>](#AutoBlacklist)  

| Param | Type |
| --- | --- |
| ip | <code>string</code> | 

<a name="AutoBlacklist+whitelistIP"></a>

### autoBlacklist.whitelistIP(ip) ⇒ <code>void</code>
Whitelist an IP

**Kind**: instance method of [<code>AutoBlacklist</code>](#AutoBlacklist)  

| Param | Type |
| --- | --- |
| ip | <code>string</code> | 

<a name="AutoBlacklist+blacklistIP"></a>

### autoBlacklist.blacklistIP(ip) ⇒ <code>void</code>
Blacklist an IP

**Kind**: instance method of [<code>AutoBlacklist</code>](#AutoBlacklist)  

| Param | Type |
| --- | --- |
| ip | <code>string</code> | 

<a name="AutoBlacklist+isBlocked"></a>

### autoBlacklist.isBlocked(ip, path) ⇒ <code>boolean</code>
Check if request should be blocked

**Kind**: instance method of [<code>AutoBlacklist</code>](#AutoBlacklist)  

| Param | Type |
| --- | --- |
| ip | <code>string</code> | 
| path | <code>string</code> | 

