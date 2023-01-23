import * as React from 'react';
import { useEffect } from 'react';
import { View, ScrollView, Image } from 'react-native';

let startMove = false;
let pageX_ = 0;
let pageY_ = 0;
let top_ = 0;
let left_ = 0;

export const DevView: React.FC = () => {
  const o = window.sessionStorage.getItem('opacity');
  const t = window.sessionStorage.getItem('top');
  const l = window.sessionStorage.getItem('left');

  const [topLeft, setTopLeft] = React.useState([
    t ? parseInt(t) : 200,
    l ? parseInt(l) : 0,
  ]);
  const ref = React.useRef<View>(null);

  const [opacity, setOpacity] = React.useState(o ? parseFloat(o) : 0);
  useEffect(() => {
    const on_mousedown = (e: KeyboardEvent) => {
      let [top, left] = topLeft;
      let op = opacity;
      // console.debug(e.key, e);
      if (e.key == 'ArrowDown') {
        if (e.metaKey) {
          op = opacity - 0.1;
          if (opacity < 0) op = 0;
        } else {
          top = top + 2;
        }
      }
      if (e.key == 'ArrowUp') {
        if (e.metaKey) {
          op = op + 0.1;
          if (op > 1) op = 1;
        } else {
          top = top - 2;
          if (top < 0) top = 0;
        }
      }
      if (e.key == 'ArrowLeft') {
        left = left - 2;
        if (left < 0) top = 0;
      }
      if (e.key == 'ArrowRight') {
        left = left + 2;
      }
      window.sessionStorage.setItem('opacity', String(op));
      window.sessionStorage.setItem('top', String(top));
      window.sessionStorage.setItem('left', String(left));
      setTopLeft([top, left]);
      setOpacity(op);
    };
    document.addEventListener('keydown', on_mousedown);
    const onMouseDown = (e: any) => {
      let [top, left] = topLeft;
      const { pageX, pageY } = e;
      pageX_ = pageX;
      pageY_ = pageY;
      top_ = top;
      left_ = left;
      startMove = true;
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('mousemove', onMouseMove);
      // console.debug('onMouseDown', pageX_, pageY_);
    };
    const { current } = ref;

    const onMouseMove = (e: any) => {
      const { pageX, pageY } = e;
      // console.debug('onMouseMove');
      if (startMove) {
        //@ts-ignore
        current.style.top = `${top_ + pageY - pageY_}px`;
        //@ts-ignore
        current.style.left = `${left_ + pageX - pageX_}px`;
      }
    };
    const onMouseUp = (e: any) => {
      if (startMove) {
        const { pageX, pageY } = e;
        setTopLeft([top_ + pageY - pageY_, left_ + pageX - pageX_]);
        startMove = false;
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('mousemove', onMouseMove);
      }
    };
    //@ts-ignore
    if (current?.firstChild) {
      //@ts-ignore
      current.firstChild.addEventListener('mousedown', onMouseDown);
    }
    return () => {
      document.removeEventListener('keydown', on_mousedown);
      const { current } = ref;
      //@ts-ignore
      if (current?.firstChild) {
        //@ts-ignore
        current.firstChild.removeEventListener('mousedown', onMouseDown);
      }
    };
  }, [ref, setTopLeft, topLeft, opacity, setOpacity]);

  return (
    <View
      ref={ref}
      style={{
        opacity: opacity,
        position: 'absolute',
        width: 390,
        height: 300,
        top: topLeft[0],
        left: topLeft[1],
        backgroundColor: 'green',
      }}
    >
      <View style={{ backgroundColor: 'blue', height: 22 }}></View>
      <ScrollView>
        <View
          style={{
            width: 390,
            height: 800,
          }}
        >
          <Image
            style={{
              flex: 1,
            }}
            source={require('../../assets/dev/app1/chats.jpg')}
            accessibilityIgnoresInvertColors
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default DevView;
