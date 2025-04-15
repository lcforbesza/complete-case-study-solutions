#!/usr/bin/env python3
import json
import sys

def analyze_plan(plan_file):
    """
    Analyze a Terraform plan JSON file to determine if it should proceed.
    
    Rules:
    1. The plan must only contain create or modify steps
    2. Modify steps must ONLY modify the resource's tags attribute, and only the GitCommitHash tag
    3. If anything else is being modified or destroyed, the plan must not proceed
    
    Args:
        plan_file (str): Path to the Terraform plan JSON file
        
    Returns:
        bool: True if the plan should proceed, False otherwise
    """
    try:
        with open(plan_file, 'r') as f:
            plan_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error reading or parsing the plan file: {e}")
        return False
    
    # Check if the plan contains resource changes
    if "resource_changes" not in plan_data:
        print("No resource changes found in the plan.")
        return True
    
    resource_changes = plan_data["resource_changes"]
    
    for resource in resource_changes:
        # Get the action being performed (create, update, delete)
        actions = resource.get("change", {}).get("actions", [])
        
        # Rule 1: Only allow create or update actions
        if "delete" in actions:
            print(f"ERROR: Resource '{resource.get('address', 'unknown')}' is being deleted, which is not allowed.")
            return False
        
        # If the action is an update, check what is being modified
        if "update" in actions:
            # Get the before and after states
            before = resource.get("change", {}).get("before", {})
            after = resource.get("change", {}).get("after", {})
            
            # Get the before and after tags
            before_tags = before.get("tags", {})
            after_tags = after.get("tags", {})
            
            # Rule 2: Only allow modifications to GitCommitHash tag
            # First, check that we're only modifying tags
            changes = resource.get("change", {}).get("before_sensitive", {})
            changes.update(resource.get("change", {}).get("after_sensitive", {}))
            
            # Check if any attribute other than 'tags' is changing
            for key in before:
                if key != "tags" and (key not in after or before[key] != after[key]):
                    print(f"ERROR: Resource '{resource.get('address', 'unknown')}' is modifying attribute '{key}', which is not allowed.")
                    return False
            
            for key in after:
                if key != "tags" and (key not in before or before[key] != after[key]):
                    print(f"ERROR: Resource '{resource.get('address', 'unknown')}' is adding attribute '{key}', which is not allowed.")
                    return False
            
            # Now check that within tags, only GitCommitHash is changing
            for tag_key in before_tags:
                if tag_key != "GitCommitHash" and (tag_key not in after_tags or before_tags[tag_key] != after_tags[tag_key]):
                    print(f"ERROR: Resource '{resource.get('address', 'unknown')}' is modifying tag '{tag_key}', which is not allowed.")
                    return False
            
            for tag_key in after_tags:
                if tag_key != "GitCommitHash" and (tag_key not in before_tags or before_tags[tag_key] != after_tags[tag_key]):
                    print(f"ERROR: Resource '{resource.get('address', 'unknown')}' is adding tag '{tag_key}', which is not allowed.")
                    return False
    
    # If we get here, all changes are acceptable
    print("All changes in the plan are acceptable. The plan can proceed.")
    return True

def main():
    if len(sys.argv) != 2:
        print("Usage: python script.py <tfplan.json>")
        sys.exit(1)
    
    plan_file = sys.argv[1]
    should_proceed = analyze_plan(plan_file)
    
    if should_proceed:
        print("PROCEED: The plan can be applied.")
        sys.exit(0)
    else:
        print("STOP: The plan cannot be applied.")
        sys.exit(1)

if __name__ == "__main__":
    main()