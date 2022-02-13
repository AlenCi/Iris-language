/**
 * Environment: names, storage
 * Made by Alen Cigler
 */
class Environment {
  /**
   * Creates a variable with the given name and value
   */
  constructor(record = {}) {
    this.record = record;
  }

  /**
   * Creates a variable with the given name and value
   */
  define(name, value) {
    this.record[name] = value;
    return value;
  }

  /**
   * Returns the value of a defined variable,
   * or throws if the variable is not defined
   */
  lookup(name) {
    if (!this.record.hasOwnProperty(name)) {
      throw new ReferenceError(`Variable "${name}" is not defined.`);
    }
    return this.record[name];
  }
}

module.exports = Environment;
