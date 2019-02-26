'use strict';

/* eslint-disable max-params */

const LRU = require('lru-cache');
const HTTP_STATUS = require('http-status');

/**
 * @class
 */
class AutoBlacklist {
  /**
   * @param {RegExp[]} [blockPatterns=[]]
   * @param {number} [maxStrikes=2]
   * @param {number} [strikeAgeMs=(1000 * 60 * 5)]
   * @param {number} [maxBlockedIPs=100000]
   * @param {string[]} [whitelist=[]]
   * @param {string[]} [blacklist=[]]
   * @returns {AutoBlacklist}
   */
  constructor(blockPatterns = [], maxStrikes = 2, strikeAgeMs = (1000 * 60 * 5), maxBlockedIPs = 100000, whitelist = [], blacklist = []) {
    this.blockPatterns = blockPatterns;

    this.whitelist = whitelist.reduce((result, ip) => {
      result[ip] = true;
      return result;
    }, []);

    this.blacklist = blacklist.reduce((result, ip) => {
      result[ip] = true;
      return result;
    }, []);

    this.blockedIPs = new LRU({
      max: maxBlockedIPs,
    });

    this.strikedIPs = new LRU({
      max: maxBlockedIPs,
      maxAgeMs: strikeAgeMs,
    });

    this.maxStrikes = maxStrikes;
    this.blockedCallback = () => {};
  }

  /**
   * Set callback for when an IP is blocked
   * @param {function} callback
   * @returns {void}
   */
  setBlockedCallback(callback) {
    this.blockedCallback = callback;
  }

  /**
   * Check if request should be blocked
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {*}
   */
  check(req, res, next) {
    const ip = req.ip || req.get('x-forwarded-for') || req.connection.remoteAddress;

    if (this.isBlocked(ip, req.path)) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'missing' });
    }

    return next();
  }

  /**
   * Add IP to the LRU blocklist
   * @param {string} ip
   * @returns {void}
   */
  block(ip) {
    this.blockedIPs.set(ip, true);
    this.blockedCallback(ip);
  }

  /**
   * Apply strike to IP
   * @param {string} ip
   * @returns {boolean}
   */
  strike(ip) {
    let count = this.strikedIPs.get(ip) || 0;
    this.strikedIPs.set(ip, ++count);

    if (count > this.maxStrikes) {
      this.block(ip);
      return true;
    }

    return false;
  }

  /**
   * Whitelist an IP
   * @param {string} ip
   * @returns {void}
   */
  whitelistIP(ip) {
    this.whitelist[ip] = true;
  }

  /**
   * Blacklist an IP
   * @param {string} ip
   * @returns {void}
   */
  blacklistIP(ip) {
    this.blacklist[ip] = true;
  }

  /**
   * Check if request should be blocked
   * @param {string} ip
   * @param {string} path
   * @returns {boolean}
   */
  isBlocked(ip, path) {
    if (this.whitelist[ip]) {
      return false;
    }

    if (this.blacklist[ip]) {
      return true;
    }

    if (this.blockedIPs.get(ip)) {
      return true;
    }

    if (this.blockPatterns.some((pattern) => pattern.test(path))) {
      return this.strike(ip);
    }

    return false;
  }
}

module.exports = AutoBlacklist;
