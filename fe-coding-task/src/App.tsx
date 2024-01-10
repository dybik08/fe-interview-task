import React, { PropsWithChildren} from 'react';
import './App.css';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import {List, ListItem, ListItemIcon, ListItemText} from '@mui/material';
import {
    Link as RouterLink,
    LinkProps as RouterLinkProps,
} from "react-router-dom"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(function Link(
    itemProps,
    ref,
) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
}

function ListItemLink(props: ListItemLinkProps) {
    const { icon, primary, to } = props;

    return (
        <li>
            <ListItem button component={Link} to={to}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}


function App({children}: PropsWithChildren<{}>) {
  return (
      
          <div className="flex">
            {/* navigation side panel */}
              <div className="mt-10" >
                  <List>
                      <ListItemLink to={"/"} primary={"Home"} />
                      <ListItemLink to={"/search-history"} primary={"Search History"} />
                  </List>
              </div>
              <div>{children}</div>
          </div>
  );
}

export default App;
