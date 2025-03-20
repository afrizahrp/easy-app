import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const CompanyDropdown = () => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Primary
            <Icon icon="heroicons:chevron-down" className=" h-5 w-5 ml-2 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[196px]" align="start">
          <DropdownMenuLabel>Company</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>BIS</DropdownMenuItem>
          <DropdownMenuItem>bipmed</DropdownMenuItem>
          <DropdownMenuItem>Karoseri</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
export default CompanyDropdown;