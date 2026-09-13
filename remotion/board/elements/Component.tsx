import type { ElementRenderProps, El } from "../types";
import { COMPONENTS } from "../../components";

type ComponentEl = El & { kind: "component" };

export const Component: React.FC<ElementRenderProps<ComponentEl>> = (props) => {
  const Comp = COMPONENTS[props.el.name];
  if (!Comp) return null;
  return <Comp {...props} />;
};
