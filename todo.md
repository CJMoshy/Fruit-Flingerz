
- looks like player data is coming into the server without animations expected..
 - this is lowkey expected but could start to be a serious issue if server slower in response. We will likely haev to default to client loading some form of defaults for incoming players until they can properly transmit data

- line 64ish in connection manager might have bricked prog
 - more specifically checking if user in map first ...
  - ideally code base should be changed so that this does not brick