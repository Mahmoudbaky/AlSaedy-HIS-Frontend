import getSidebarContent from './sidebaritems';
import SimpleBar from 'simplebar-react';
import {
  Activity,
  Ambulance,
  BookMarked,
  Building2,
  ChartBar,
  Circle,
  CircleUser,
  Hospital,
  Pill,
  ScanLine,
  ShieldPlus,
  Stethoscope,
  Store,
  TestTube,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import FullLogo from '../../shared/logo/FullLogo';
import { Link, useLocation } from 'react-router';
import { useTheme } from 'src/components/provider/theme-provider';
import { AMLogo, AMMenu, AMMenuItem, AMSidebar, AMSubmenu } from 'tailwind-sidebar';
import 'tailwind-sidebar/styles.css';
import { useTranslation } from 'react-i18next';
import { useUser } from 'src/hooks/useUser';

/** Lucide icon keys used in sidebaritems.ts */
const SIDEBAR_ICON_MAP: Record<string, LucideIcon> = {
  chart: ChartBar,
  testTube: TestTube,
  scanner: ScanLine,
  ambulance: Ambulance,
  activity: Activity,
  pill: Pill,
  store: Store,
  building: Building2,
  bookMarked: BookMarked,
  shieldPlus: ShieldPlus,
  hospital: Hospital,
  stethoscope: Stethoscope,
  userCircle: CircleUser,
};

interface SidebarItemType {
  heading?: string;
  id?: number | string;
  name?: string;
  title?: string;
  icon?: string;
  url?: string;
  children?: SidebarItemType[];
  disabled?: boolean;
  isPro?: boolean;
}

const renderSidebarItems = (
  items: SidebarItemType[],
  currentPath: string,
  onClose?: () => void,
  isSubItem: boolean = false,
) => {
  return items.map((item) => {
    const isSelected = currentPath === item?.url;
    const IconComp = item.icon ? SIDEBAR_ICON_MAP[item.icon] : null;

    const iconElement = IconComp ? (
      <IconComp size={21} className="shrink-0 text-current" />
    ) : (
      <Circle size={9} className="shrink-0 text-current" strokeWidth={2} />
    );

    // Heading
    if (item.heading) {
      return (
        <div className="mb-1" key={item.heading}>
          <AMMenu
            subHeading={item.heading}
            ClassName="hide-menu leading-21 text-white! font-bold uppercase text-xs"
          />
        </div>
      );
    }

    // Submenu
    if (item.children?.length) {
      return (
        <AMSubmenu
          key={item.id}
          icon={iconElement}
          title={item.name}
          ClassName="mt-0.5 text-white! bg-transparent "
        >
          {renderSidebarItems(item.children, currentPath, onClose, true)}
        </AMSubmenu>
      );
    }

    // Regular menu item
    const linkTarget = item.url?.startsWith('https') ? '_blank' : '_self';

    const itemClassNames = isSubItem
      ? `mt-0.5 text-white! bg-transparent hover:bg-white/10 ${isSelected ? '!bg-white/10 text-white!' : ''}`
      : `mt-0.5 text-white! bg-transparent hover:bg-white/10 ${isSelected ? '!bg-white/10 text-white!' : ''}`;

    return (
      <div onClick={onClose}>
        <AMMenuItem
          key={item.id}
          icon={iconElement}
          isSelected={isSelected}
          link={item.url || undefined}
          target={linkTarget}
          data-selected={isSelected ? 'true' : undefined}
          aria-current={isSelected ? 'page' : undefined}
          badge={!!item.isPro}
          badgeColor="bg-lightsecondary"
          badgeTextColor="text-secondary"
          disabled={item.disabled}
          badgeContent={item.isPro ? 'Pro' : undefined}
          component={Link}
          className={`${itemClassNames}`}
        >
          <span className="truncate flex-1 text-white!">{item.title || item.name}</span>
        </AMMenuItem>
      </div>
    );
  });
};

const SidebarLayout = ({ onClose }: { onClose?: () => void }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { user } = useUser();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isAdmin = user?.role === 'admin';
  const sidebarItems = getSidebarContent(t, isAdmin);



  // Only allow "light" or "dark" for AMSidebar
  const sidebarMode = theme === 'light' || theme === 'dark' ? theme : undefined;

  return (
    <AMSidebar
      collapsible="none"
      animation={true}
      showProfile={false}
      width={'270px'}
      showTrigger={false}
      mode={sidebarMode}
      className="app-sidebar fixed top-0 border border-border dark:border-border bg-primary text-white z-10 h-screen"
    >
      {/* Logo */}
      <div className="px-6 flex items-center brand-logo overflow-hidden">
        <AMLogo component={Link} href="/" img="">
          <FullLogo />
        </AMLogo>
      </div>

      {/* Sidebar items */}

      <SimpleBar className="h-[calc(100vh-100px)]">
        <div className="px-6">
          {sidebarItems.map((section, index) => (
            <div key={index}>
              {renderSidebarItems(
                [
                  ...(section.heading ? [{ heading: section.heading }] : []),
                  ...(section.children || []),
                ],
                pathname,
                onClose,
              )}
            </div>
          ))}

          {/* <div className="mt-9 overflow-hidden">
            <div className="flex w-full bg-lightprimary rounded-lg p-6">
              <div className="lg:w-1/2 w-full">
                <h5 className="text-base text-sidebar-foreground">Haven't Account?</h5>
                <Button className="whitespace-nowrap mt-2 text-[13px]">Get Pro</Button>
              </div>
              <div className="lg:w-1/2 w-full -mt-4 ml-[26px] scale-[1.2] shrink-0">
                <img src={rocket} alt="rocket" />
              </div>
            </div>
          </div> */}
        </div>
      </SimpleBar>
    </AMSidebar>
  );
};

export default SidebarLayout;
