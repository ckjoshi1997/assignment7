import React from 'react';
import URLSearchParams from 'url-search-params';
import { withRouter } from 'react-router-dom';
import {
  ButtonToolbar, Button, FormGroup, FormControl, ControlLabel, InputGroup,
  Row, Col,
} from 'react-bootstrap';

class ItemFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
      category: params.get('category') || '',
      priceMin: params.get('priceMin') || '',
      priceMax: params.get('priceMax') || '',
      changed: false,
    };

    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onChangeEffortMin = this.onChangeEffortMin.bind(this);
    this.onChangeEffortMax = this.onChangeEffortMax.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  onChangeCategory(e) {
    this.setState({ category: e.target.value, changed: true });
  }

  onChangeEffortMin(e) {
    const priceString = e.target.value;
    if (priceString.match(/^\d*$/)) {
      this.setState({ priceMin: e.target.value, changed: true });
    }
  }

  onChangeEffortMax(e) {
    const priceString = e.target.value;
    if (priceString.match(/^\d*$/)) {
      this.setState({ priceMax: e.target.value, changed: true });
    }
  }

  showOriginalFilter() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      category: params.get('category') || '',
      priceMin: params.get('priceMin') || '',
      priceMax: params.get('priceMax') || '',
      changed: false,
    });
  }

  applyFilter() {
    const { category, priceMin, priceMax } = this.state;
    const { history } = this.props;
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (priceMin) params.set('priceMin', priceMin);
    if (priceMax) params.set('priceMax', priceMax);

    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({ pathname: '/items', search });
  }

  render() {
    const { category, changed } = this.state;
    const { priceMin, priceMax } = this.state;
    return (
      <Row>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Category:</ControlLabel>
            <FormControl
              componentClass="select"
              value={category}
              onChange={this.onChangeCategory}
            >
              <option value="">(All)</option>
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="Fixed">Fixed</option>
              <option value="Closed">Closed</option>
            </FormControl>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Effort between:</ControlLabel>
            <InputGroup>
              <FormControl value={priceMin} onChange={this.onChangeEffortMin} />
              <InputGroup.Addon>-</InputGroup.Addon>
              <FormControl value={priceMax} onChange={this.onChangeEffortMax} />
            </InputGroup>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>&nbsp;</ControlLabel>
            <ButtonToolbar>
              <Button bsStyle="primary" type="button" onClick={this.applyFilter}>
                Apply
              </Button>
              <Button
                type="button"
                onClick={this.showOriginalFilter}
                disabled={!changed}
              >
                Reset
              </Button>
            </ButtonToolbar>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}

export default withRouter(ItemFilter);
