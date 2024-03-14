import express from 'express';
import { engine } from 'express-handlebars';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", "./src/views");

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
