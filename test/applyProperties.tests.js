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

  it("skips subsequent invocation with frozen childNodes", () => {
    const fixture = document.createElement('div');
    const text = new Text('foo');
    const childNodes = [text];
    Object.freeze(childNodes);
    applyProperties(fixture, { childNodes });
    assert.equal(fixture.childNodes.length, 1);
    assert.equal(fixture.childNodes[0], text);
    fixture.removeChild(text);
    // Next line should have no effect.
    applyProperties(fixture, { childNodes });
    assert.equal(fixture.childNodes.length, 0);
  });
  
  it("merges new updates on top of existing attributes", () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="foo bar" style="color: red;" aria-selected="false"></div>
    `;
    const fixture = template.content.children[0];
    applyProperties(fixture, {
      attributes: {
        role: 'main'
      },
      classList: {
        foo: false,
        bletch: true
      },
      style: {
        color: 'green'
      }
    });
    assert.equal(fixture.getAttribute('role'), 'main');
    assert(!fixture.classList.contains('foo'));
    assert(fixture.classList.contains('bar'));
    assert(fixture.classList.contains('bletch'));
    assert.equal(fixture.style.color, 'green');
  });

});
