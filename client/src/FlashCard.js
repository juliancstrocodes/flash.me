import { Box, Card, CardContent, Typography, Button } from "@material-ui/core";

const removeCard = (index) => {};

// add properties
function FlashCard({ term, definition, index }) {
  return (
    <Box className="cards__box" sx={{ width: 300, height: "100%" }}>
      <Card style={{ backgroundColor: "#61dbfb", height: "50%" }}>
        <CardContent>
          <Typography variant="subtitle1" whiteSpace="pre-wrap">
            <code style={{ color: "white" }}>
              {/** truncate to two lines */}
              {term.length > 40 ? `${term.substring(0, 40)}...` : term}{" "}
            </code>
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="caption" whiteSpace="pre-wrap">
            <code style={{ color: "white" }}>
              {/** truncate to two lines */}
              {definition.length > 60
                ? `${definition.substring(0, 60)}...`
                : definition}
            </code>
          </Typography>
        </CardContent>
      </Card>
      <Button className="card__remove">
        <code style={{ color: "white" }}>Remove</code>
      </Button>
    </Box>
  );
}

export default FlashCard;
