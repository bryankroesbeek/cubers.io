""" Routes related to displaying overall Sum Of Ranks results. """

from flask import render_template, jsonify

from app import app
from app.persistence.user_site_rankings_manager import get_user_site_rankings_all_sorted_single,\
    get_user_site_rankings_all_sorted_average, get_user_site_rankings_wca_sorted_average,\
    get_user_site_rankings_wca_sorted_single, get_user_site_rankings_non_wca_sorted_average,\
    get_user_site_rankings_non_wca_sorted_single

# -------------------------------------------------------------------------------------------------

SOR_TYPE_ALL     = 'all'
SOR_TYPE_WCA     = 'wca'
SOR_TYPE_NON_WCA = 'non_wca'

# -------------------------------------------------------------------------------------------------

# @app.route('/sum_of_ranks/<sor_type>/')
@app.route('/api/sum-of-ranks/<sor_type>/')
def sum_of_ranks(sor_type):
    """ A route for showing sum of ranks. """

    # if sor_type not in (SOR_TYPE_ALL, SOR_TYPE_WCA, SOR_TYPE_NON_WCA):
    #     return ("I don't know what kind of Sum of Ranks this is.", 404)

    # If "all", get combined Sum of Ranks
    if sor_type == SOR_TYPE_ALL:
        return jsonify({
            'title': "Sum of Ranks – Combined",
            'singles' : clean_ranks(get_user_site_rankings_all_sorted_single()),
            'averages': clean_ranks(get_user_site_rankings_all_sorted_average())
        })

    # If "wca", get WCA Sum of Ranks
    elif sor_type == SOR_TYPE_WCA:
        return jsonify({
            'title': "Sum of Ranks – WCA",
            'singles': clean_ranks(get_user_site_rankings_wca_sorted_single()),
            'averages': clean_ranks(get_user_site_rankings_wca_sorted_average())
        })

    # Otherwise must be "non_wca", so get non-WCA Sum of Ranks
    elif sor_type == SOR_TYPE_NON_WCA:
        return jsonify({
            'title': "Sum of Ranks – Non-WCA",
            'singles': clean_ranks(get_user_site_rankings_non_wca_sorted_single()),
            'averages': clean_ranks(get_user_site_rankings_non_wca_sorted_average())
        })

    return "", 404

def clean_ranks(records):
    return list(map(lambda solve: {
        'rank_count': solve[0],
        'user': {
            'id': solve[1].id,
            'name': solve[1].username,
            'verified': solve[1].is_verified
        }
    }, records))
