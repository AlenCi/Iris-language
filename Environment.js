/**
 * Environment: names, storage
 * Made by Alen Cigler
 */
class Environment {
  /**
   * Creates a variable with the given name and value
   */
  constructor(record = {}, parent = null) {
    this.record = record;
    this.parent = parent;
  }

  /**
   * Creates a variable with the given name and value
   */
  define(name, value) {
    this.record[name] = value;
    return value;
  }

  /**
   * Updates an existing variable
   */
  assign(name, value) {
    this.resolve(name).record[name] = value;
    return value;
  }
  /**
   * Returns the value of a defined variable,
   * or throws if the variable is not defined
   */
  lookup(name) {
    return this.resolve(name).record[name];
  }

  /**
   * Returns specific environment in which a variable is defined (identifier resolution)
   * or throws if the variable is not defined
   */
  resolve(name) {
    if (this.record.hasOwnProperty(name)) {
      return this;
    }

    if (this.parent == null) {
      // in global env
      throw new ReferenceError(`Variable "${name}" is not defined.`); //todo  Error handling in separate file
    }
    return this.parent.resolve(name);
  }
}

module.exports = Environment;
