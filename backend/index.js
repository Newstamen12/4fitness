const app = require('./server');

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`[SERVER] Running cleanly on port: ${port} (${process.env.NODE_ENV || 'development'})`);
});
