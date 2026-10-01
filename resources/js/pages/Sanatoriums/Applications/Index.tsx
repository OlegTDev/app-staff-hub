import { router } from "@inertiajs/react";
import { Button } from "antd";

type Props = {

}

export default function Index({}: Props): React.JSX.Element {
  return (
    <div>
      SANATORIUMS APPLICATIONS

      <Button onClick={() => router.get(route('sanatoriums.applications.create'))}>Click me</Button>
    </div>
  );
}
