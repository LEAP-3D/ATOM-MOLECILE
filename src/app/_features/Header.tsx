import LogoIcon from "../_icons/LogoIcon";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <div className="flex justify-center">
      <div className="flex justify-between w-[1440px] h-[100px] items-center ">
        <div>
          <LogoIcon />
        </div>
        <div className="flex gap-2">
          <Button>Log in</Button>
          <Button>Sign up</Button>
        </div>
      </div>
    </div>
  );
}
