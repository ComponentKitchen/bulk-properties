import * as updates from '../../src/updates.js';


describe("updates helpers", () => {

  it("updates.get gets existing updates from an element", () => {
    container.innerHTML = `
      <div class="foo bar" style="color: red;" aria-selected="false"></div>
    `;
    const fixture = container.children[0];
    const fixtureProps = updates.current(fixture);
    assert.deepEqual(fixtureProps, {
      attributes: {
        'aria-selected': 'false'
      },
      classes: {
        bar: true,
        foo: true
      },
      style: {
        color: 'red'
      }
    });
  });

  it("updates applies $ updates to referenced elements", () => {
    const fixture = document.createElement('div');
    fixture.$ = {
      child: document.createElement('button')
    };
    fixture.appendChild(fixture.$.child);
    updates.apply(fixture, {
      $: {
        child: {
          attributes: {
            'aria-label': 'Label',
            disabled: true
          }
        }
      }
    });
    assert(fixture.$.child.disabled);
    assert.equal(fixture.$.child.getAttribute('aria-label'), 'Label');
  });

  it("updates.merge with no arguments returns an empty object", () => {
    const fixture = updates.merge();
    assert.deepEqual(fixture, {});
  });

  it("updates.merge merges multiple updates dictionaries together", () => {
    const updates1 = {
      attributes: {
        'aria-selected': 'false'
      },
      classes: {
        bar: true
      },
      style: {
        'background-color': 'gray',
        color: 'black'
      },
      customProperty0: 'Hello',
      customProperty1: 0
    };
    const updates2 = {
      attributes: {
        'aria-selected': 'true'
      },
      classes: {
        foo: true
      },
      style: {
        color: 'red'
      },
      customProperty1: 1,
      customProperty2: true
    };
    const merged = updates.merge(updates1, updates2);
    assert.equal(merged.attributes['aria-selected'], 'true');
    assert.deepEqual(merged.classes, { bar: true, foo: true });
    assert.equal(merged.style['background-color'], 'gray');
    assert.equal(merged.style.color, 'red');
    assert.equal(merged.customProperty0, 'Hello');
    assert.equal(merged.customProperty1, 1);
    assert.equal(merged.customProperty2, true);
  });

  it("merge can merge $ updates", () => {
    const updates1 = {
      $: {
        one: {
          attributes: {
            'aria-selected': 'false'
          },
          style: {
            'background-color': 'gray',
            color: 'black'
          }
        },
        two: {
          classes: {
            foo: true
          }
        }
      }
    };
    const updates2 = {
      $: {
        one: {
          attributes: {
            hidden: false
          },
          style: {
            color: 'red'
          }
        },
        two: {
          classes: {
            bar: true
          }
        }
      }
    };
    const actual = updates.merge(updates1, updates2);
    const expected = {
      $: {
        one: {
          attributes: {
            'aria-selected': 'false',
            hidden: false
          },
          style: {
            'background-color': 'gray',
            color: 'red'
          }
        },
        two: {
          classes: {
            foo: true,
            bar: true
          }
        }
      }
    };
    assert.deepEqual(actual, expected);
  });

});
