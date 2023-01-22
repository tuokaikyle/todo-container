import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import { useState, useEffect, useRef } from 'react';

function Index() {
  const gridRef = useRef();
  const [state, setState] = useState({
    count: 0,
    info: '',
    items: [],
    color: '',
  });

  useEffect(() => {
    gridRef.current =
      gridRef.current ||
      GridStack.init(
        {
          float: true,
          cellHeight: '50px',
          minRow: 1,
          margin: 5,
        },
        '.uncontrolled'
      );
    const grid = gridRef.current;

    grid.on('dragstop', (event, element) => {
      const node = element.gridstackNode;
      setState((prevState) => ({
        ...prevState,
        info: `you just dragged node #${node.id} to ${node.x},${node.y} – good job!`,
      }));

      let timerId;
      window.clearTimeout(timerId);
      timerId = window.setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          info: '',
        }));
      }, 2000);
    });
  }, []);

  const getNode = function () {
    let n = state.items[state.count] || {
      x: 0,
      y: 0,
      w: 2,
      h: 2,
    };
    n.content = n.content || String(state.count);
    n.color = 'bg-lime-200';
    setState((prevState) => ({
      ...prevState,
      count: prevState.count + 1,
    }));
    return n;
  };

  const makeNewWidget = function () {
    let n = getNode();
    let doc = document.implementation.createHTMLDocument();
    doc.body.innerHTML = `
    <div class="item ${n.color} rounded-2xl" gs-x="${n.x}" gs-y="${n.y}" gs-w="${n.w || 1}" gs-h="${n.h || 1}">
      <div class="grid-stack-item-content">${n.content}</div>
    </div>
    </div>`;
    let el = doc.body.children[0];
    const grid = gridRef.current;
    grid.el.appendChild(el);
    // example showing when DOM is created elsewhere (eg Angular/Vue/React) and GS is used to convert to a widget
    let w = grid.makeWidget(el);
  };

  return (
    <div>
      <button
        className="btn"
        onClick={() => {
          makeNewWidget();
        }}
      >
        Add Widget
      </button>
      <div>{JSON.stringify(state)}</div>
      <section className="grid-stack uncontrolled"></section>
    </div>
  );
}

export default Index;
