class A {
  constructor() {
      this.nameA = 'a'
  }
  validateA() {
      console.log("A")
  }
}

class B extends A {
  constructor() {
      super()
      this.nameB = 'b'
  }

  validateB() {
      console.log("B")
  }
}

class C extends B {
  constructor() {
      super()
      this.nameC = 'c'
  }

  validateC() {
      console.log("C")
  }
}
const c = new C()
function findMembers(instance, fieldPerfix, funcPerfix) {
  function _find(instance) {
    if (instance.__proto__ === null) {
      return []
    }
    let names = Reflect.ownKeys(instance)
    names = names.filter(name => _shouldKeep(name))
    return [...names, ..._find(instance.__proto__)]
  }

  function _shouldKeep(value) {
    if (value.startsWith(fieldPerfix) || value.startsWith(funcPerfix)) {
      return true
    }
  }
  return _find(instance)
}

console.log(findMembers(c, 'name', 'validate'))