import applyProperties from '../src/applyProperties.js';


describe("applyProperties", () => {

  it("sets regular attributes", () => {
    const fixture = document.createElement('div');
    applyProperties(fixture, {
      attributes: {
        role: 'main'
      }
    });
    assert.equal(fixture.getAttribute('role'), 'main');
    applyProperties(fixture, {
      attributes: {
        role: null
      }
    });
    assert.equal(fixture.getAttribute('role'), null);
  });

  it("sets boolean attributes", () => {
    const fixture = document.createElement('button');
    applyProperties(fixture, {
      attributes: {
        disabled: true
      }
    });
    assert.equal(fixture.disabled, true);
    applyProperties(fixture, {
      attributes: {
        disabled: false
      }
    });
    assert.equal(fixture.disabled, false);
  });

  it("sets classes on or off", () => {
    const fixture = document.createElement('div');
    applyProperties(fixture, {
      classList: {
        foo: true,
        bar: true
      }
    });
    assert(fixture.classList.contains('foo'));
    assert(fixture.classList.contains('bar'));
    applyProperties(fixture, {
      classList: {
        foo: false
      }
    });
    assert(!fixture.classList.contains('foo'));
    assert(fixture.classList.contains('bar'));
  });

  it("sets child nodes", () => {
    const fixture = document.createElement('div');
    const existingChild = document.createTextNode('existing');
    fixture.appendChild(existingChild);
    const childNodes = [
      document.createTextNode('one'),
      document.createTextNode('two')
    ];
    applyProperties(fixture, { childNodes });
    assert.equal(fixture.childNodes.length, 2);
    assert.equal(fixture.childNodes[0], childNodes[0]);
    assert.equal(fixture.childNodes[1], childNodes[1]);
    assert.isNull(existingChild.parentNode);
  });

  it("sets custom properties", () => {
    const fixture = document.createElement('div');
    applyProperties(fixture, {
      foo: true,
      bar: 'Hello'
    });
    assert(fixture.foo);
    assert.equal(fixture.bar, 'Hello');
  });
  
  it("applies multiple types of properties at once", () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="foo bar" style="color: red;" aria-selected="false"></div>
    `;
    const fixture = template.content.children[0];
    const childNodes = [new Text('Hello')];
    applyProperties(fixture, {
      attributes: {
        role: 'main'
      },
      classList: {
        foo: false,
        bletch: true
      },
      childNodes,
      style: {
        color: 'green'
      },
      custom: true
    });
    assert.equal(fixture.getAttribute('role'), 'main');
    assert(!fixture.classList.contains('foo'));
    assert(fixture.classList.contains('bar'));
    assert(fixture.classList.contains('bletch'));
    assert.deepEqual(fixture.childNodes.length, 1);
    assert.equal(fixture.childNodes[0], childNodes[0]);
    assert.equal(fixture.style.color, 'green');
    assert(fixture.custom);
  });

});
