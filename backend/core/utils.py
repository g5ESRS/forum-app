def _get_results(response):
    """
    Extract results from a paginated response or return the raw response data if pagination is not enabled.
    """
    return response.data.get("results", response.data)
