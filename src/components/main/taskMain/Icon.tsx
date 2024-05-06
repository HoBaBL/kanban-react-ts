import { DragControls } from "framer-motion";
import style from '../main.module.css'

interface Props {
  dragControls: DragControls;
}

export function ReorderIcon({ dragControls }: Props) {
  return (
    <div className={style.drop} onPointerDown={(event) => dragControls.start(event)} >

    </div>
  );
}